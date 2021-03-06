import React from 'react';
import { EnvProvider, useEnv } from '../src';
import { render } from './utils';

// Set username in window environment
const varName = 'USERNAME';
const varValue = 'john';
(window as any)._env_ = {
    USERNAME: varValue,
};

const ProfilePage = () => {
    const env = useEnv();

    return <div data-testid="username">{env.get(varName)}</div>;
};

const TestContainer = () => {
    return (
        <EnvProvider>
            <ProfilePage />
        </EnvProvider>
    );
};

describe('<EnvContext />', () => {
    it('provides environment variables with values', () => {
        const { getByTestId } = render(<TestContainer />);
        expect(getByTestId('username').textContent).toBe(varValue);
    });
});
