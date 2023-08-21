import { getRRPP } from "../graphql/queries";
import { API, graphqlOperation } from 'aws-amplify';

const checkRRPP = async (user) => {
  const userData = await API.graphql(
    graphqlOperation(getRRPP, { id: user })
  );

  if (userData.data.getRRPP !== null) {
    return true;
  } else {
    return false;
  }
};

export default checkRRPP;