using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Template.Core.Command;
using Template.Core.Data;
using Template.Utility.Email.Services;
using Template.Utility.Services;
using Template.Web.Extensions;
using Template.Web.Identity;
using Template.Web.Models.Account;
using Template.Web.Models.Account.Email;

namespace Template.Web.Controllers
{
    [Authorize]
    public class AccountController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SmtpMailSender _mailSender;
        private readonly ViewRenderService _viewRenderService;
        private readonly IMapper _mapper;

        public AccountController(IMediator mediator, 
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            SmtpMailSender mailSender,
            ViewRenderService viewRenderService, 
            IMapper mapper)
        {
            _mediator = mediator;
            _signInManager = signInManager;
            _userManager = userManager;
            _mailSender = mailSender;
            _viewRenderService = viewRenderService;
            _mapper = mapper;
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    // _logger.LogInformation("User logged in.");
                    var user = await _userManager.FindByEmailAsync(model.Email);
                    return Ok(new LoginResult { IsAuthenticated = true, CurrentUser = _mapper.Map<CurrentUserViewModel>(user) });
                }
                if (result.RequiresTwoFactor)
                {
                    return Ok(new LoginResult { RequiresTwoFactor = true });
                }
                if (result.IsLockedOut)
                {
                    // _logger.LogWarning("User account locked out.");
                    return Ok(new LoginResult { IsLockedOut = true });
                }
                else
                {
                    return Ok(new LoginResult { IsInvalidAttempt = true });

                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> LoginWith2fa([FromBody] LoginWith2faViewModel model, bool rememberMe)
        {
            if (!ModelState.IsValid)
            {
                return Ok(new LoginResult());
            }

            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var authenticatorCode = model.TwoFactorCode.Replace(" ", string.Empty).Replace("-", string.Empty);
            var result = await _signInManager.TwoFactorAuthenticatorSignInAsync(authenticatorCode, rememberMe, model.RememberMe);
            if (result.Succeeded)
            {
                // _logger.LogInformation("User with ID {UserId} logged in with 2fa.", user.Id);
                return Ok(new LoginResult { IsAuthenticated = true, CurrentUser = _mapper.Map<CurrentUserViewModel>(user) });
            }
            else if (result.IsLockedOut)
            {
                //_logger.LogWarning("User with ID {UserId} account locked out.", user.Id);
                return Ok(new LoginResult { IsLockedOut = true });
            }
            else
            {
                // _logger.LogWarning("Invalid authenticator code entered for user with ID {UserId}.", user.Id);
                ModelState.AddModelError(string.Empty, "Invalid authenticator code.");
                return Ok(new LoginResult { IsInvalid2Fa = true });
            }
        }

        [HttpGet]
        public async Task<IActionResult> EnableAuthenticator()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var key = await _userManager.GetAuthenticatorKeyAsync(user);
            if (string.IsNullOrEmpty(key))
            {
                await _userManager.ResetAuthenticatorKeyAsync(user);
                key = await _userManager.GetAuthenticatorKeyAsync(user);
            }
            var formattedKey = string.Join(' ', key.Chunks(4).ToArray());
            return Ok(new EnableAuthenticatorViewModel
            {
                SharedKey = formattedKey,
                AuthenticatorUri = GenerateQrCodeUri(user.Email, key)
            });
        }

        private const string AuthenicatorUriFormat = "otpauth://totp/{0}:{1}?secret={2}&issuer={0}&digits=6";

        private string GenerateQrCodeUri(string email, string unformattedKey)
        {
            return string.Format(AuthenicatorUriFormat, HttpUtility.UrlEncode(Constants.PROJECT_NAME), HttpUtility.UrlEncode(email), unformattedKey);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EnableAuthenticator([FromBody] EnableTwoFactorViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return Ok(new EnableTwoFactorResult { Success = false });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            var verificationCode = model.Code.Replace(" ", string.Empty).Replace("-", string.Empty);
            var is2faTokenValid = await _userManager.VerifyTwoFactorTokenAsync(user, _userManager.Options.Tokens.AuthenticatorTokenProvider, verificationCode);
            if (!is2faTokenValid)
            {
                return Ok(new EnableTwoFactorResult{ Success = false }); 
            }

            await _userManager.SetTwoFactorEnabledAsync(user, true);
            var recoveryCodes = (await _userManager.GenerateNewTwoFactorRecoveryCodesAsync(user, 10)).ToList();

            return Ok(new EnableTwoFactorResult { Success = true, RecoveryCodes = recoveryCodes});
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetAuthenticator()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            await _userManager.SetTwoFactorEnabledAsync(user, false);
            await _userManager.ResetAuthenticatorKeyAsync(user);
            return Ok();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByEmailAsync(model.Email);
                if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
                {
                    return Ok(new ForgotPasswordResult { EmailSend = false });
                }

                var code = await _userManager.GeneratePasswordResetTokenAsync(user);
                var callbackUrl = Url.Action(
                action: nameof(AccountController.ResetPassword),
                controller: "Account",
                values: new { user.Id, code },
                protocol: Request.Scheme);

                model.CallbackUrl = callbackUrl;
                var mailHtml = await _viewRenderService.RenderMailHtml("ForgotPassword", model);
                _mailSender.SendEmail(model.Email, "Reset your password", mailHtml);
                return Ok(new ForgotPasswordResult { EmailSend = true });
            }

            return Ok(new ForgotPasswordResult { EmailSend = false });
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Ok(new ResetPasswordResult { IsReset = false });
            }
            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
            if (result.Succeeded)
            {
                return Ok(new ResetPasswordResult { IsReset = true });
            }
            return Ok(new ResetPasswordResult { IsReset = false });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            var user = await _userManager.GetUserAsync(User);
            if (user == null || !user.Email.Equals(model.Email, StringComparison.OrdinalIgnoreCase))
            {
                return Ok(new ChangePasswordResult { HasChanged = false });
            }
            var result = await _userManager.ChangePasswordAsync(user, model.Password, model.NewPassword);
            if (result.Succeeded)
            {
                return Ok(new ChangePasswordResult { HasChanged = true });
            }
            return Ok(new ChangePasswordResult { HasChanged = false });
        }

        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user.");
            }

            return Ok(_mapper.Map<CurrentUserViewModel>(user));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProfile([FromBody] UpdateApplicationUserModel inputModel) 
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user.");
            }
            if(!user.Email.Equals(inputModel.Email, StringComparison.OrdinalIgnoreCase))
            {
                throw new ApplicationException($"Invalid email updating profile {user.Email} != {inputModel.Email}");
            }
            await _mediator.Send(new UpdateApplicationUserCommand(inputModel));
            user = await _userManager.GetUserAsync(User);

            return Ok(_mapper.Map<CurrentUserViewModel>(user));
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (userId == null || code == null)
            {
                ViewData["ErrorMessage"] = "An error occured. Your email has been not been confirmed"; // TODO Localize
                return RedirectToAction(nameof(HomeController.Index), "Home"); 
            }
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new ApplicationException($"Unable to load user with ID '{userId}'.");
            }
            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (result.Succeeded)
            {
                ViewData["SuccessMessage"] = "Your email has been confirmed"; // TODO Localize
                return RedirectToAction(nameof(HomeController.Index), "Home"); 
            }
            ViewData["ErrorMessage"] = "An error occured. Your email has been not been confirmed"; // TODO Localize
            return RedirectToAction(nameof(HomeController.Index), "Home"); 
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            // _logger.LogInformation("User logged out.");
            return Ok(new LoginResult { IsAuthenticated = false });
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmAccount(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return View("Error");

            }
            var user = await _userManager.FindByIdAsync(userId);
            return View(new EmailConfirmationViewModel() { Code = code, UserId = userId, Email = user.Email });
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ConfirmAccount(EmailConfirmationViewModel viewModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (viewModel.UserId == null || viewModel.Code == null)
            {
                return View("Error");
            }
            var user = await _userManager.FindByIdAsync(viewModel.UserId);
            if (user == null)
            {
                return View("Error");
            }

            var result = await _userManager.ConfirmEmailAsync(user, viewModel.Code);
            if (result.Succeeded)
            {
                var res = await _userManager.AddPasswordAsync(user, viewModel.Password);
                if (!res.Succeeded)
                {
                    return View("ConfirmAccount", viewModel); // TODO
                }

                return View("AccountConfirmed", viewModel); // TODO
            }
            else
            {
                // throw error
                return View("ConfirmAccount", viewModel); // TODO
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SignUp([FromBody] SignUpViewModel viewModel)
        {
            var user = await _userManager.FindByEmailAsync(viewModel.Email);
            if (user != null)
            {
                return Ok(new SignUpResult { DuplicateEmail = true });
            }
            user = new ApplicationUser
            {
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                Email = viewModel.Email,
                UserName = viewModel.Email
            };
            var result = await _userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                // send email confirmation link
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmUrl = Url.Action("ConfirmAccount", 
                    "Account", 
                    new EmailConfirmationViewModel { UserId = user.Id, Code = code }, 
                    Request.Scheme);
                var view = Path.Combine(Directory.GetCurrentDirectory(), "Views/Email/ConfirmAccountEmail.cshtml");
                var mailHtml = await _viewRenderService.RenderMailHtml(view, new Callback(confirmUrl));
                _mailSender.SendEmail(viewModel.Email, "Confirm your account", mailHtml);
                return Ok(new SignUpResult { Success = true });
            }
            else
            {
                return Ok(new SignUpResult());
            }
        }
    }
}
