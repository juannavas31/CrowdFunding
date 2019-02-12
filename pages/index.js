import React, {Component} from 'react';
import { Card, Button } from 'semantic-ui-react';
import campaignFactory from '../ethereum/factoryContract';
import Layout from '../components/layout';
import { Link } from '../routes';


// now we define a React class based component
class CampaignIndex extends Component{
    // we define a static function, so we don't have to declare an instance
    // we can call it like this: CampaignIndex.getInitialProps()
    static async getInitialProps(){
        // fetch list of deployed campaigns from the factory contract
        const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
        // console.log('campaigns', campaigns);
        // now return the campaings object that will go into props object
        // so we will have available props.campaigns

        return {campaigns}; // ES6 equivalent to {campaigns:campaigns}
    };

    async componentDidMount(){

    };

    renderCampaigns() {
        // we need to build an array with the addesses of the campaigns
        // we do it by using array.map() function, which iterates over the elements
        const items = this.props.campaigns.map( (address) =>
                            {
                                return {
                                    header: address ,
                                    meta: 'meta-value',
                                    description: (
                                        <Link route={`/campaigns/${address}`}>
                                            <a>link to details</a>
                                        </Link> ) ,
                                    fluid : true
                                }
                            }
                        );

        return <Card.Group items={items} />; // again the notation {items:items}
    }

    // every react component has to return a JSX data
    render(){
        return (
            <Layout>
                <div>
                    <h2>Campaigns Index</h2>
                    <div>
                        <Link route='/campaigns/new'>
                          <a>
                            <Button floated='right' icon='add circle' content='Add Campaign' primary={true} />
                          </a>
                        </Link>
                    </div>
                    {this.renderCampaigns()}
                </div>
            </Layout>);
    };  // end render()

};

// 'next' framework always expects that each component exports something.
// so we export the class component.
export default CampaignIndex;
