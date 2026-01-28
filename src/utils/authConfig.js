import { IS_DEV } from "../constant";
import { auth } from "../firebase";

export const DEV_TOKEN =
    "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE5ZGRjYTc2YzEyMzMyNmI5ZTJlODJkOGFjNDg0MWU1MzMyMmI3NmEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU2h1YmhhbSBEd2l2ZWRpIiwicm9sZSI6MCwiZmluYWNjcnVfYWNjZXNzIjp0cnVlLCJmaW52YXVsdF9hY2Nlc3MiOnRydWUsImZpbnZvaWNlX2FjY2VzcyI6dHJ1ZSwiZmluYmlsbF9hY2Nlc3MiOnRydWUsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9maW5hY2NydS1zdGFnaW5nIiwiYXVkIjoiZmluYWNjcnUtc3RhZ2luZyIsImF1dGhfdGltZSI6MTc0MzQ5MzA5NywidXNlcl9pZCI6IklXdWtpWVpXMDFmSlRRYUpCcHR3eVNmalJENDMiLCJzdWIiOiJJV3VraVlaVzAxZkpUUWFKQnB0d3lTZmpSRDQzIiwiaWF0IjoxNzQzNDkzMDk3LCJleHAiOjE3NDM0OTY2OTcsImVtYWlsIjoiZGV2LnNodWJoYW0xNzA2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXIiOiIrOTcxOTcxMTU3OTM3IiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJkZXYuc2h1YmhhbTE3MDZAZ21haWwuY29tIl0sInBob25lIjpbIis5NzE5NzExNTc5MzciXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.CcT9KO5j718hdQGauA_LTZmGkkmw4MpJIeEbrIe2GoNJFN5v-LyVnReNhl1Y9zh1PfYCG2QCNZBC0uWVOvrbOu7FY7EfA_0DZxZ9cJ3tpkOfu3kgKcbxB4hEl734cQ9NQq2_jBDJRwIW47fara8f6DmB1mQpwW87kjnzW-55-15bvP8WzeJtQFYhsPR_N28enYYjbXB57cnIlvXSzd2kToiUnADJDWw5lZjz0v9v-Me1iHLIx2ylYyj0Y4nYP85oAWJz33u75sqk0CG5_fKu82j5-_jFsis-wQFUdHc6VOvBhh4wC2a-tt8PjkGmt5UdhJ1C-DSDLo6tKrSq5_9SIQ";

export const getAuthConfig = async () => {
    if (IS_DEV) {
        return {
            headers: {
                token: DEV_TOKEN,
            },
        };
    } else {
        const token = await auth.currentUser.getIdToken();
        return {
            headers: {
                token: token,
            },
        };
    }
};
