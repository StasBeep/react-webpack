import { Route, Routes } from 'react-router-dom';

import MainPage from '../components/pages/MainPage';
import SecondPage from '../components/pages/SecondPage';
import Calculate from '../components/pages/Calculate';

const Router = () => {
    return (
        <Routes>
            <Route path="/" index element={<MainPage />} />
            <Route path='/second' element={<SecondPage />} />
            <Route path='/calc' element={<Calculate />} />
        </Routes>
    );
};

export default Router;