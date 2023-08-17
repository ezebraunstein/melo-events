import { getRRPP } from "../graphql/queries";
import { API, graphqlOperation } from 'aws-amplify';

const checkRRPP = async (user) => {

  const userCreado = user.username;
  const userData = await API.graphql(
    graphqlOperation(getRRPP, { id: userCreado })
  );

  if (userData.data.getRRPP !== null) {
    return true;
  } else {
    return false;
  }
};

export default checkRRPP;