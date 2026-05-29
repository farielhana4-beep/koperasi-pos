import { Component } from 'react';

export default class PosErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        if (import.meta.env.DEV) {
            // Keep the console trace in development so we can still debug the root cause.
            console.error('POS error boundary caught an error:', error, info);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 text-white shadow-2xl shadow-black/30">
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                        Cashier fallback
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold">The POS view had a rendering issue.</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                        We kept the page alive to avoid a blank screen. Refresh the page or clear the cart and try again. If the issue persists, check the latest console error and product data payload.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}
