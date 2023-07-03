import Dashboard from "../../components/layout/dashboard";

export default function App({children}) {
    return (
        <Dashboard>
            {children}
        </Dashboard>
    )
}