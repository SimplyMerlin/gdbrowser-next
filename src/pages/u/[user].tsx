import {
  GetServerSideProps,
  GetServerSidePropsResult,
  GetStaticProps,
} from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import GD, { Permission, Socials } from "gd.js";
import { Fragment, useEffect, useState } from "react";
import { getCORSProxy } from "../_app";

type CollectibleProp = {
  name: string;
  amount: string;
  source: string;
};

type SerializableUserData = {
  username: string;
  id: number;
  accountID: number;
  stats: {
    stars: number;
    diamonds: number;
    demons: number;
    rank: number;
    coins: {
      normal: number;
      user: number;
    };
    cp: number;
  };
  permissions: Permission;
  socials: Socials;
};

const User = (props: { userdata: SerializableUserData }) => {
  return (
    <main className="brownBox text-white">
      <div className="grid place-items-center">
        <h1
          style={{
            textShadow: "0.375vh 0.375vh 0vh rgba(0, 0, 0, 0.3)",
          }}
          className="font-pusab my-1 textStroke text-center text-4xl"
        >
          <Badge permission={props.userdata.permissions} />
          <span>{props.userdata.username}</span>
        </h1>
        <hr className="my-2 w-full" />
        <div className="my-2 w-full">
          <Collectibles stats={props.userdata.stats} />
        </div>
        <ul className="border-[#803E1E] border-[1px] w-full rounded-2xl overflow-scroll my-2 h-72">
          <Comments />
          <Comments />
          <Comments />
          <Comments />
          <Comments />
        </ul>
      </div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (
    !context.params ||
    !context.params.user ||
    typeof context.params.user !== "string"
  ) {
    return {
      notFound: true,
    };
  }

  const gd = new GD({});
  const userdata = await gd.users.getByUsername(context.params.user);

  return {
    props: {
      userdata: {
        username: userdata.username,
        id: userdata.id,
        accountID: userdata.accountID,
        stats: userdata.stats,
        permissions: userdata.permissions,
        socials: userdata.socials,
      },
    },
  };
};

export default User;

const Collectibles = ({ stats }: any) => {
  return (
    <div
      style={{
        textShadow: "0.2vh 0.2vh 0vh rgba(0, 0, 0, 0.3)",
      }}
      className="font-pusab text-2xl smallTextStroke w-full grid grid-cols-5 justify-between"
    >
      <Collectible name="Stars" amount={stats.stars} source="star" />
      <Collectible name="Diamonds" amount={stats.diamonds} source="diamond" />
      <Collectible
        name="Secret Coins"
        amount={stats.coins.user}
        source="coin"
      />
      <Collectible
        name="User Coins"
        amount={stats.coins.normal}
        source="silvercoin"
      />
      <Collectible name="Demons" amount={stats.demons} source="demon" />
    </div>
  );
};
const Collectible = ({ name, amount, source }: CollectibleProp) => {
  return (
    <div className="grid justify-items-center gap-x-1">
      <div className="h-8 flex items-center">
        <span>{amount}</span>
      </div>
      <img className="h-8" src={`/${source}.png`} title={name}></img>
    </div>
  );
};

const Badge = ({ permission }: { permission: Permission }) => {
  let src;
  let description;
  switch (permission.raw) {
    case 1:
      src = "/mod.png";
      description = "Moderator";
      break;
    case 2:
      src = "/mod-elder.png";
      description = "Elder Moderator";
      break;
    default:
      return <Fragment></Fragment>;
  }
  return <img className="h-8 inline mr-1" title={description} src={src}></img>;
};

const Comments = () => {
  return (
    <li className="even:bg-[#A1582C] odd:bg-[#be6f3f] p-2 border-b-[1px] last:border-b-0 border-black">
      <div className="bg-[#934f27]/80 rounded-xl p-2">
        <div className="font-pusab text-lg">SimplyMerlin</div>
        <div className="text-md leading-snug">
          2 years later and i finally beat my first demon this is what i call a
          ultra flex
        </div>
      </div>
    </li>
  );
};
