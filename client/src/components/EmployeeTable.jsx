import {
    Table,
} from 'react-bootstrap';

import EmployeeTableBody from './EmployeeTableBody';
import EmployeeTableHeader from './EmployeeTableHeader'

const EmployeeTable = ({ employees, deleteEmployee }) => {
    return (
        <Table striped hover responsive className="mb-0">
            <EmployeeTableHeader />

            <EmployeeTableBody employees={employees} deleteEmployee={deleteEmployee} />


        </Table>
    )
}

export default EmployeeTable