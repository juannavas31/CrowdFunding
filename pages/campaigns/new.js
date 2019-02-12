import React, { Component } from 'react';
import Layout from '../../components/layout';
import { Button, Checkbox, Form, Input, Message } from 'semantic-ui-react';
import factoryContract from '../../ethereum/factoryContract';
import web3js from '../../ethereum/web3';
import { Router } from '../../routes';


class CampaignNew extends Component {

    state = {
        minimumContribution:'', // initially empty
        errorMessage : '',
        loadingFlag : false
    };

    // event handler for the submit button
    // defined as an arrow function, so that it can be called as this.onSubmit
    onSubmit = async (event) =>{
        // by default, the browswer will send the info from the form to the server
        // we don't want that, we need to interact with the smart-contract.
        event.preventDefault();

        // start up the spinner just after user has clicked the button
        // and clear the errorMessage
        this.setState({loadingFlag: true, errorMessage: ''});


        try {
            const accounts = await web3js.eth.getAccounts();

            // now we can attempt to create a new Campaign
            // in this case, running in the broswer, metamask can calculate the amount of gas needed
            // so we don't really need to specify it.
            await factoryContract.methods.createCampaign(this.state.minimumContribution)
                                    .send({from:accounts[0],
                                            gas: '6000000'});
            // inmediately after creating the campaign, we move to the root page 
            Router.pushRoute('/');
        } catch (errorCreate) {
            this.setState({errorMessage: errorCreate.message});
        };

        this.setState({loadingFlag:false});
    };

    render() {
            return (
                <Layout>
                    <div>
                        <h3>Create Campaign</h3>
                        <p>
                        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                          <Form.Field>
                            <label>Minium contribution (wei)</label>
                            <Input label='wei' labelPosition='right' placeholder='100'
                                value={this.state.minimumContribution}
                                onChange={(event)=>{ this.setState({minimumContribution:event.target.value})}}
                            />
                          </Form.Field>

                          <Form.Field>
                            <Checkbox label='I agree to the Terms and Conditions' />
                          </Form.Field>
                          <Message error header='Ooops!' content={this.state.errorMessage} />
                          <Button loading={this.state.loadingFlag} primary type='submit'>Create</Button>
                        </Form>
                        </p>
                    </div>
                </Layout>
            );
    };

};

export default CampaignNew;
