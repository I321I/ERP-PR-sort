import { Button, Nav } from "react-bootstrap"
import styles from './Navigation.module.scss'

export const Navigation: React.FC = () => {
    return (
        <Nav className={`${styles.Nav} `}>
            <Nav.Item className={`${styles.NavItem}`}>
                <Nav.Link eventKey="disabled" disabled>
                    ERP請購狀況表對照
                </Nav.Link>
                <Button className="position-absolute top-5 end-0 text-nowrap" variant="outline-dark" onClick={() => { localStorage.clear(); window.location.reload() }}>刪除所有資料</Button>
            </Nav.Item>
        </Nav >
    )
}
