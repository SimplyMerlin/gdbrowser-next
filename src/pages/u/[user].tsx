import {
  GetServerSideProps,
  GetServerSidePropsResult,
  GetStaticProps,
} from "next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import GD, { Permission, Socials } from "gd.js";
import { useEffect, useState } from "react";
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
    <main className="h-screen w-full">
      <div className="absolute">
        <img
          src="/back.png"
          className="h-16 m-4"
          onClick={() => history.back()}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <img className="sticky" src="/corner.png" width="7%" />
      </div>
      <div className="absolute bottom-0 right-0 w-full text-end pointer-events-none">
        <img
          className="sticky scale-x-[-1] inline"
          src="/corner.png"
          width="7%"
        />
      </div>
      <div className="h-full grid place-items-center">
        <div className="brownBox w-[135vh] h-[82%] text-white">
          <h1
            style={{
              textShadow: "0.375vh 0.375vh 0vh rgba(0, 0, 0, 0.3)",
            }}
            className="font-pusab textStroke text-center text-6xl"
          >
            {props.userdata.username}
          </h1>
          <hr className="my-4" />
          <div className="my-4 grid justify-center">
            <Collectibles stats={props.userdata.stats} />
          </div>
        </div>
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
      className="font-pusab text-4xl smallTextStroke flex gap-x-8"
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
    <div className="flex gap-x-2">
      <div className="h-11 flex items-center">
        <span>{amount}</span>
      </div>
      <img className="h-11" src={`/${source}.png`} title={name}></img>
    </div>
  );
};
