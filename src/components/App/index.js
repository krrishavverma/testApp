import './style.css';
import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import App from '../../components/ImageData';
import axios from 'axios';
import Button from '@material-ui/core/Button';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));


function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [listOfImages, setListOfImages] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState('');
  const [imageBase64, setimageBase64] = React.useState('');
  const [value, setValue] = React.useState();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  React.useEffect(() => {
    try {
      axios.get('http://127.0.0.1:5003/image-name').then(
        res => {
          setListOfImages(() => {
            setSelectedImage(res.data['image_name'][0])
            return res.data['image_name']
          });
        }
      )
    } catch (error) {
    }
  }, []);

  function getImage(e, imgName) {
    setSelectedImage(imgName)
  }


  function handleChange(e) {
    let reader = new FileReader();
    reader.onload = function (e) {
      setimageBase64(() => {
        return reader.result
      });
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  function addMoreImages() {
    if (imageBase64 != "") {
      const payload = { 'image_base64': imageBase64 };

      axios.post('http://127.0.0.1:5003/add-detail', payload).then(
        res => {
          setListOfImages([...listOfImages, res.data.Image_Name]);
          setSelectedImage(res.data.Image_Name)
        })
    }
  }

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {listOfImages.map((imgName, index) => (
          <ListItem button key={imgName} onClick={(e) => getImage(e, imgName)}>

            <ListItemText primary={imgName} />
          </ListItem>
        ))}
      </List><br></br>
      <input className='add-more-display' type="file" onChange={handleChange} /><br></br><br></br>
      <Button className='add-more-display' variant="contained" color="primary" onClick={addMoreImages}>Add</Button>

    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            IFill Data Verification
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {selectedImage == "" ? null : <App imageName={selectedImage} imageList={listOfImages} />}
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
