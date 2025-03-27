import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/App.jsx'

// describe() defines a test suite, which is a collection of tests with a related purpose, like tests for
// a component, class, feature, function, etc.
describe('App', () => {
    // it() defines a test case, which is a single test.
    it('renders the App component', () => {
        // render() takes any JSX and renders it. The output of this is sent to "screen"
        render(<App />);
        // To see what's rendered, you can use screen.debug(), which prints the output to the console.
        // Alternatively, you can use getByX() to test for values, like below:
        expect(screen.getByText('Home')).toBeInTheDocument();
        // The getByX() functions throw an error if the element isn't found, so use queryByX() for values you expect to be null:
        expect(screen.queryByText("My Account")).toBeNull();
        // Deliberately failing test
        expect(false).toBe(true);
    });
    // For further reference, see this tutorial: https://www.robinwieruch.de/react-testing-library/
})