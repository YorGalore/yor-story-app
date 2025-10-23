import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about-page';
import LoginPage from '../pages/login-page';
import AddStoryPage from '../pages/add-story-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(), 
  '/add': new AddStoryPage(),
};

export default routes;