import React from 'react';
import Header from './header';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';  // this component allows us to place components in the head part of the html document

// common layout logic for all pages

export default (props) => {
    return(
        <Container>
            <Head>
                <link rel="stylesheet"
                  href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
                />
            </Head>
            <Header />
            {props.children}
            <h3>By Juan Navas</h3>
        </Container>
    );
};
