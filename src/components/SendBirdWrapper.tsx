import Channel from "@sendbird/uikit-react/Channel";
import { useEffect, useState } from "react";
import { save_channel, updateUserChannel } from "@/database/channel";
import { update } from "@/database/user";
import { useSession } from "next-auth/react";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { GroupChannelModule } from "@sendbird/chat/groupChannel";
import GroupChannelHandler from "@sendbird/uikit-react/handlers/GroupChannelHandler";
import SendbirdChat, { User } from "@sendbird/chat";
import ChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";

const APP_ID = process.env.APP_ID!;

export default function SendBirdWrapper() {
  const [currentChannel, setCurrentChannel] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [channelToDelete, setChannelToDelete] = useState<string>("");

  const globalStore = useSendbirdStateContext();
  const sdk = globalStore?.stores?.sdkStore?.sdk;
  const { data: session } = useSession();

  const sb = SendbirdChat.init({
    appId: APP_ID,
    modules: [new GroupChannelModule()],
  });

  useEffect(() => {
    const groupChannelHandler = new GroupChannelHandler({
      onChannelDeleted: (channelUrl, channelType) => {
        setCurrentChannel(channelUrl!);
      },
    });

    sb.groupChannel.addGroupChannelHandler("NEWTON-3275", groupChannelHandler);
  }, [sdk, sb.groupChannel]);

  useEffect(() => {
    const updateChannel = async () => {
      const deleted_channel = await updateUserChannel(channelToDelete);
    };
  }, [channelToDelete]);

  /**
   * updates user database
   */
  const userProfileEdited = async (user: User) => {
    const data = {
      email: session?.user?.email!,
      nickname: user.nickname,
      user_profile: user.plainProfileUrl,
    };
    await update(data);
  };

  /**
   * check new channel and add to db
   * @param channel
   * @returns
   */
  const channelCreated = async (channel: GroupChannel) => {
    const data = {
      url: channel.url,
      creator: [channel.creator?.nickname, channel.creator?.userId],
      created_at: new Date().toISOString(),
      channel_name: channel.name,
    };
    const new_channel = await save_channel(data);
    return new_channel;
  };

  return (
    <>
      <div className="flex h-screen z-10 mt-10">
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
            onUserProfileUpdated={(user) => {
              userProfileEdited(user);
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
            />
          </div>
        )}
      </div>
    </>
  );
}
