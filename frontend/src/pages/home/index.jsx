import { getUser } from '../../services/authService';
import RootHome from '../../pages/root/home';
import EmployeeHome from '../../pages/employee/home';

function Home() {
    const user = getUser();
    const role = user?.role;

    switch (role) {
        case 'root':
            return <RootHome />;
        case 'employee':
            return <EmployeeHome />;
        default:
            return <EmployeeHome />;
    }
}

export default Home;