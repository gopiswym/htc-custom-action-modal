import React from 'react';
import Header from './header';
import Wishlist from './wishlist';
import store from "../app/store";
import { Provider } from 'react-redux';

const App = () => (
	<div id="app" className="wishlist">
		<Provider store={store}>
			<Header className="wishlist" />
			<Wishlist />
		</Provider>
	</div>
)

export default App;
