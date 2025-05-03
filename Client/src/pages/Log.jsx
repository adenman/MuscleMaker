import Cal from "../components/Cal";
import { useParams } from "react-router-dom";
import { GET_USER_BY_ID } from "../utils/queries";
import { useQuery } from "@apollo/client";

const Log = () => {
    const { userId } = useParams();
    const { loading, data } = useQuery(GET_USER_BY_ID, {
      variables: { userId: userId },
    });

    // Add loading and error handling
    if (loading) return <div>Loading...</div>;
    if (!data || !data.oneUser) return <div>No user data found</div>;

    return (
        <div>
            <div>
                <h1 className='t text-center rounded'>Calendar</h1>
                <Cal/>
            </div>

            <div>
                <h1 className="flex justify-center mt-5">Your Log</h1>
                {data.oneUser.completedRegiments.map((regiment, index) => (
                    <div className="flex justify-center workout-card  test2 rounded p-4 my-2 mx-2 t back w-full" key={index}>
                        {regiment.name && (
                            <h1>{regiment.name} {regiment.date}</h1>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Log;