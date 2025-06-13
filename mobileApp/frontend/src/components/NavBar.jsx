import { Home } from '@mui/icons-material';
import { Button, Grid2 as Grid } from '@mui/material';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const NavBar = () => {
    return (
        <Grid position="fixed" sx={{ height: "80vh", display: { sx: "none", md: "flex" }, flexDirection: "column", top: "70px" }} >
            <Button color="inherit" sx={{ display: "flex", px: "0px", marginTop: "10px", flexDirection: "column", alignItems: "center", fontSize: "10px", textTransform: "capitalize" }}>
                <Home sx={{ fontSize: 25 }} />
                Acceuil
            </Button>
            <Button color="inherit" sx={{ display: "flex", px: "0px", marginTop: "10px", flexDirection: "column", alignItems: "center", fontSize: "10px", textTransform: "capitalize" }}>
                <QueueOutlinedIcon sx={{ fontSize: 25 }} />
                Short
            </Button>
            <Button color="inherit" sx={{ display: "flex", px: "0px", marginTop: "10px", flexDirection: "column", alignItems: "center", fontSize: "10px", textTransform: "capitalize" }}>
                <SubscriptionsOutlinedIcon sx={{ fontSize: 25 }} />
                Abonnements
            </Button>
            <Button color="inherit" sx={{ display: "flex", px: "0px", marginTop: "10px", flexDirection: "column", alignItems: "center", fontSize: "10px", textTransform: "capitalize" }}>
                <AccountCircleOutlinedIcon sx={{ fontSize: 25 }} />
                Vous
            </Button>
        </Grid>
    );
}

export default NavBar;