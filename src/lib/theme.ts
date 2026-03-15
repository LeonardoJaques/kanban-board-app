// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

import { createMuiTheme } from '@material-ui/core/styles';



export const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

export const theme = createMuiTheme({
    palette: isDark ? {
        type: 'dark',
        primary: {
            main: '#8b5cf6',
        },
        secondary: {
            main: '#10b981',
        },
    } : {
        type: 'light',
        primary: {
            main: '#7c3aed',
        },
        secondary: {
            main: '#10b981',
        },
    },
});
