import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GavelIcon from '@mui/icons-material/Gavel';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Link from "next/link";

const links = [
  { name: "Clientes", href: "/dashboard/clientes", icon: <PeopleAltIcon /> },
  { name: "Consultas", href: "/dashboard/consultas", icon: <QuestionAnswerIcon /> },
  { name: "Usuários", href: "/dashboard/users", icon: <AdminPanelSettingsIcon /> },
  { name: "Consultar Leis", href: "/dashboard/leis", icon: <GavelIcon /> },
  { name: "Pesquisar Leis", href: "/dashboard/pesquisa_leis", icon: <ManageSearchIcon />}
];

function DrawerList() {
  return (
    <div>
      {links.map((link, index) => (
        <Link
          href={link.href}
          key={link.name}
          style={{ textDecoration: "none", color: "inherit" }}>
          <ListItem button>
            <ListItemIcon>{link.icon}</ListItemIcon>
            <ListItemText primary={link.name} />
          </ListItem>
        </Link>
      ))}
    </div>
  );
}

export default DrawerList;