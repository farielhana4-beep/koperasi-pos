function IconBase({ children, className = 'h-5 w-5' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

export function DashboardIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M4 4h7v7H4z" />
            <path d="M13 4h7v4h-7z" />
            <path d="M13 10h7v10h-7z" />
            <path d="M4 13h7v7H4z" />
        </IconBase>
    );
}

export function ProductsIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M20 7.5 12 3 4 7.5v9L12 21l8-4.5z" />
            <path d="M12 12v9" />
            <path d="M4 7.5 12 12l8-4.5" />
        </IconBase>
    );
}

export function PosIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M4 7h16v10H4z" />
            <path d="M7 17v3" />
            <path d="M17 17v3" />
            <path d="M8 11h8" />
            <path d="M8 14h4" />
        </IconBase>
    );
}

export function ReportsIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M5 19V5" />
            <path d="M5 19h14" />
            <path d="M8 15v-3" />
            <path d="M12 15V8" />
            <path d="M16 15v-5" />
        </IconBase>
    );
}

export function SettingsIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" />
            <path d="M19.4 15a8 8 0 0 0 .1-6l-2 .5a6.2 6.2 0 0 0-1.1-1.8l1.2-1.7a8.1 8.1 0 0 0-5.3-2l-.4 2a6.3 6.3 0 0 0-2.1 0l-.4-2a8.1 8.1 0 0 0-5.3 2l1.2 1.7A6.2 6.2 0 0 0 5.5 9.5l-2-.5a8 8 0 0 0 .1 6l2-.5a6.2 6.2 0 0 0 1.1 1.8l-1.2 1.7a8.1 8.1 0 0 0 5.3 2l.4-2a6.3 6.3 0 0 0 2.1 0l.4 2a8.1 8.1 0 0 0 5.3-2l-1.2-1.7a6.2 6.2 0 0 0 1.1-1.8z" />
        </IconBase>
    );
}

export function UsersIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" />
            <circle cx="9" cy="7" r="3" />
            <path d="M22 19v-1a3.5 3.5 0 0 0-2.5-3.35" />
            <path d="M16 4.5a3 3 0 0 1 0 6" />
        </IconBase>
    );
}

export function SearchIcon(props) {
    return (
        <IconBase {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
        </IconBase>
    );
}

export function BellIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M15 17H5l1.3-1.6a4 4 0 0 0 .9-2.5V10a5 5 0 1 1 10 0v2.9a4 4 0 0 0 .9 2.5L19.4 17z" />
            <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
        </IconBase>
    );
}

export function SparklesIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z" />
            <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z" />
        </IconBase>
    );
}

export function ScanIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M4 7V5a1 1 0 0 1 1-1h2" />
            <path d="M17 4h2a1 1 0 0 1 1 1v2" />
            <path d="M20 17v2a1 1 0 0 1-1 1h-2" />
            <path d="M7 20H5a1 1 0 0 1-1-1v-2" />
            <path d="M8 8h8v8H8z" />
        </IconBase>
    );
}

export function ReceiptIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M7 3h10v18l-2-1-2 1-2-1-2 1-2-1-2 1z" />
            <path d="M9 8h6" />
            <path d="M9 12h6" />
            <path d="M9 16h3" />
        </IconBase>
    );
}

export function ArrowUpRightIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M7 17 17 7" />
            <path d="M9 7h8v8" />
        </IconBase>
    );
}

export function ShieldIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M12 3 20 6v6c0 5-3.5 8-8 11-4.5-3-8-6-8-11V6z" />
            <path d="M9 12l2 2 4-5" />
        </IconBase>
    );
}

export function DownloadIcon(props) {
    return (
        <IconBase {...props}>
            <path d="M12 3v11" />
            <path d="m8 10 4 4 4-4" />
            <path d="M5 20h14" />
        </IconBase>
    );
}

