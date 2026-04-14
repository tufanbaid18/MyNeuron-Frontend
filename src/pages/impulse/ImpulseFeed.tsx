import CreatePost from "../../components/impulse/CreatePost";
import Feed from "../../components/impulse/Feed";
import FeedNews from "../../components/impulse/FeedNews";
import FeedProfile from "../../components/impulse/FeedProfile";
import MyActivityOverview from "../../components/impulse/MyActivityOverview";
import PagesOverview from "../../components/impulse/PagesOverview";
import ErrorComponent from "../../components/ui/ErrorComponent";
import Loading from "../../components/ui/Loading";
import { useUserProfile } from "../../hooks/auth/useUserProfile";

const ImpulseFeed = () => {
  const { data: user, isLoading, error } = useUserProfile();

  if (isLoading) return <Loading />;
  if (error) return <ErrorComponent />;
  if (!user) return <ErrorComponent />;

  // user is guaranteed to be UserProfile from here
  return (
    <div className="grid grid-cols-12 gap-5 p-2 md:p-3 lg:p-5 h-full">
      <div className="col-span-3 flex flex-col gap-5">
        <FeedProfile user={user} />
        <MyActivityOverview />
        <PagesOverview />
      </div>
      <div className="col-span-6 flex flex-col overflow-y-auto">
        <CreatePost />
        <Feed />
      </div>
      <div className="col-span-3">
        <FeedNews />
      </div>
    </div>
  );
};

export default ImpulseFeed;
