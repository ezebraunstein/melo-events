import { getUser } from "../graphql/queries";
import { API, graphqlOperation } from 'aws-amplify';

const checkUser = async (user) => {
    const userData = await API.graphql(
        graphqlOperation(getUser, { id: user })
    );

    if (userData.data.getUser !== null) {
        return true;
    } else {
        return false;
    }
};

export default checkUser;