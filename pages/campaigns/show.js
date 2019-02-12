import React, { Component } from 'react';
import Layout from '../../components/layout';
import { Button, Checkbox, Form, Input, Message } from 'semantic-ui-react';
import web3js from '../../ethereum/web3';
import { Router } from '../../routes';


// this component will show the details of a campaign, which are:
// - Camapaign Balance
// - Minium contribution
// - Pending requests
// - Number of contributors
// then we will also have a form to contribute to the Campaign
// and finally a button to View requests

class CampaignShow extends Component {


    render(){
        return (
            <Layout>
            <div>
                <h3> Campaign Details </h3>
            </div>
            </Layout>
        );
    };

};

export default CampaignShow;
