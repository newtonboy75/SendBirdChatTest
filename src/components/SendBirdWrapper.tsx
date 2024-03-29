import Channel from "@sendbird/uikit-react/Channel";
import { useState } from "react";
import ChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";
import { useSession } from "next-auth/react";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { useRouter } from "next/navigation";
import { leave_channel, save_channel } from "@/database/channel";
import { update } from "@/database/user";

export default function SendBirdWrapper() {
  const [currentChannel, setCurrentChannel] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const globalStore = useSendbirdStateContext();

  const { data: session } = useSession();
  const router = useRouter();

  /**
   * updates user database
   */
  const userProfileEdited = async () => {
    const data = {
      email: session?.user?.email!,
      nickname: globalStore?.stores?.userStore?.user.nickname,
      user_profile: globalStore?.stores?.userStore?.user.profileUrl,
    };

    await update(data);
  };

  /**
   * check new channel and add to db
   * @param channel 
   * @returns 
   */
  const channelCreated = async (channel: GroupChannel) => {
    console.log(channel);

    const data = {
      url: channel.url,
      creator: [channel.creator?.nickname, channel.creator?.userId],
      created_at: new Date().toISOString(),
      channel_name: channel.name,
    };
    const new_channel = await save_channel(data);
    return new_channel;
  };

  /**
   * updates channel db when user leaves the 
   * group channel
   * 
   * @param channel 
   */
  const leftChannel = async (channel: string) => {
    const channel_url = await leave_channel(channel);
    router.refresh();
  };

  return (
    <>
      <div className="flex h-screen customized-app">
        <div className="sendbird-app__channellist-wrap">
          <GroupChannelList
            channelListQueryParams={{
              includeEmpty: true,
            }}
            onChannelSelect={(channel) => {
              if (channel?.url) {
                setCurrentChannel(channel.url);
              }
            }}
            allowProfileEdit={true}
            onChannelCreated={(channel) => channelCreated(channel)}
            onUserProfileUpdated={() => {
              userProfileEdited();
            }}
            disableAutoSelect={false}
          />
        </div>
        <div className="sendbird-app__conversation-wrap flex-1">
          <Channel
            channelUrl={currentChannel}
            onChatHeaderActionClick={() => {
              setShowSettings(true);
            }}
          />
        </div>
        {showSettings && (
          <div className="sendbird-app__settingspanel-wrap">
            <ChannelSettings
              channelUrl={currentChannel}
              onCloseClick={() => {
                setShowSettings(false);
              }}
              onLeaveChannel={() => {
                leftChannel(currentChannel);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
