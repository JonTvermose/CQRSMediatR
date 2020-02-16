import * as React from 'react';
import ErrorService from "../../services/ErrorService";

interface ErrorObject {
    error: any;
    errorInfo: any;
    hasError?: boolean;
    errorWasLogged?: boolean;
}

class ErrorBoundary extends React.Component<any, ErrorObject> {
    private errorService: ErrorService;
    constructor(props: any) {
        super(props);
        this.errorService = new ErrorService();
        this.state = {
            error: null,
            errorInfo: null,
            hasError: false,
            errorWasLogged: true
        };
    }

    static getDerivedStateFromError = error => {
        return { hasError: true };
    };

    componentDidCatch(error: any, errorInfo: any) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo.componentStack
        })
        // You can also log error messages to an error reporting service here
        let errorData: ErrorObject = {
            error: error,
            errorInfo: errorInfo.componentStack
        };
        try {
            this.errorService.logError(errorData)
                .then(res => res.json())
                .then(res => {
                    console.log("Error logged successfully");
                    this.setState({ errorWasLogged: true });
                }).catch(e => {
                    console.log("Error logging error");
                });
        } catch {
            this.setState({ errorWasLogged: false });
        }

    }

    reload = () => {
        location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container mt-5">
                    <h1 className="text-danger">Sorry! Something went wrong.</h1>
                    <hr className="mt-4"/>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo}
                    </details>
                    <hr className="mt-4" />
                    {this.state.errorWasLogged &&
                        <h4 className="mt-4 text-primary">The error has been logged to the developers.</h4>}
                    <button className="btn btn-outline-primary btn-lg mt-4" onClick={this.reload}>Click here to reload the page.</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;