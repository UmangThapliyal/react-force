import React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';

/**
 * Renders HTML content
 */
export interface HtmlViewProps extends BoxProps {
    html: string;
}

export const HtmlView = ({ html, ...rest }: HtmlViewProps) => {
    return <Box dangerouslySetInnerHTML={{ __html: html }} {...rest} />;
};
