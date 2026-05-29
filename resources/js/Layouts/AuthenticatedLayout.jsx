import AppLayout from '@/Layouts/AppLayout';

export default function AuthenticatedLayout({ header, title, children }) {
    return (
        <AppLayout header={header} title={title}>
            {children}
        </AppLayout>
    );
}
