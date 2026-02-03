import { Nav } from "react-bootstrap"
import styles from './Navigation.module.scss'

export const Navigation: React.FC = () => {
    return (
        <Nav className={`${styles.Nav} btn-primary`}>
            <Nav.Item className={`${styles.NavItem}`}>
                <Nav.Link eventKey="disabled" disabled>
                    ERP請購狀況表對照
                </Nav.Link>
            </Nav.Item>
        </Nav>
    )
}
