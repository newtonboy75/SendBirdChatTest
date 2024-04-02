import Channel from "@sendbird/uikit-react/Channel";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GroupChannel } from "@sendbird/chat/groupChannel";
import { GroupChannelModule } from "@sendbird/chat/groupChannel";
import GroupChannelHandler from "@sendbird/uikit-react/handlers/GroupChannelHandler";
import SendbirdChat, { User } from "@sendbird/chat";
import ChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";
import { ConnectionArgs } from "@/lib/types/types";
import { doFetch } from "@/lib/helpers/connection";

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
        setChannelToDelete(channelUrl!);
      },
    });

    sb.groupChannel.addGroupChannelHandler("NEWTON-3275", groupChannelHandler);
  }, [sdk, sb.groupChannel]);

  useEffect(() => {
    const updateChannel = async () => {
      //const deleted_channel = await updateUserChannel(channelToDelete);

      if (channelToDelete !== "") {
        const body_data = {
          url: channelToDelete,
          deleted: true,
        };

        const updateArgs: ConnectionArgs = {
          url: "http://localhost:3000/api/channel",
          params: {
            method: "put",
            body: JSON.stringify(body_data),
            headers: {
              "Content-Type": "application/json",
            },
          },
        };

        const updatedChannel: any = await doFetch<string>(updateArgs).then(
          (res) => {
            return res;
          }
        );
      }
    };

    updateChannel();
  }, [channelToDelete]);

  /**
   * updates user database
   */
  const userProfileEdited = async (user: User) => {
    const body_data = {
      email: session?.user?.email!,
      nickname: user.nickname,
      user_profile: user.plainProfileUrl,
    };

    const connectionArgs: ConnectionArgs = {
      url: "http://localhost:3000/api/user/email",
      params: {
        method: "put",
        body: JSON.stringify(body_data),
      },
    };

    const editedUser: any = await doFetch<string>(connectionArgs).then(
      (res) => {
        return res;
      }
    );

    //server component implementation/old action
    //await update(data);
  };

  /**
   * check new channel and add to db
   * @param channel
   * @returns
   */
  const channelCreated = async (channel: GroupChannel) => {
    const body_data = {
      url: channel.url,
      creator: [channel.creator?.nickname, channel.creator?.userId],
      created_at: new Date().toISOString(),
      channel_name: channel.name,
    };

    const connectionArgs: ConnectionArgs = {
      url: "http://localhost:3000/api/channel",
      params: {
        method: "post",
        body: JSON.stringify(body_data),
      },
    };

    const createdChannel: any = await doFetch<string>(connectionArgs).then(
      (res) => {
        return res;
      }
    );

    // const new_channel = await save_channel(data);
    // return new_channel;
  };

  const channelModified = async (channel: GroupChannel) => {
    const body_data = {
      url: channel.url,
      channel_name: channel.name,
    };

    const updateArgs: ConnectionArgs = {
      url: "http://localhost:3000/api/channel",
      params: {
        method: "put",
        body: JSON.stringify(body_data),
        headers: {
          "Content-Type": "application/json",
        },
      },
    };

    const updatedChannel: any = await doFetch<string>(updateArgs).then(
      (res) => {
        return res;
      }
    );
  };

  return (
    <>
      <div className="flex flex-row w-full h-screen sendbird-app__channellist-wrap mt-10">
        <div className="sendbird-channel-list">
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
        <div className="sendbird-conversation">
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
              onChannelModified={(channel) => {
                channelModified(channel);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
