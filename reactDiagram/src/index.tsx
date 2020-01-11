import * as React from 'react';
import ReactDOM from 'react-dom';

import { BodyWidget } from './components/BodyWidget';
import { Application } from './Application';

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(<BodyWidget app={new Application()}/>, document.querySelector('#application'));
});
