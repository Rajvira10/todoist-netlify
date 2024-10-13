import type {
  MetaFunction,
  LoaderFunction,
  LinksFunction,
} from "@remix-run/node";

import styles from "./tailwind.css?url";

import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { rootAuthLoader } from "@clerk/remix/ssr.server";
// Import ClerkApp
import { ClerkApp } from "@clerk/remix";
import { commitSession, getSession, ToastMessage } from "./message.server";
import { useEffect } from "react";
import { Toaster } from "~/components/ui/toaster";

import { useToast } from "~/hooks/use-toast";
import { GlobalLoading } from "./components/GlobalLoader";

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "Todoist",
    viewport: "width=device-width,initial-scale=1",
  },
];
export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader: LoaderFunction = (args) => {
  try {
    return rootAuthLoader(args, async ({ request }) => {
      const session = await getSession(request.headers.get("cookie"));

      const toastMessage = session.get("toastMessage") as ToastMessage;

      if (!toastMessage) {
        return json({ toastMessage: null });
      }

      if (!toastMessage.type) {
        throw new Error("Message should have a type");
      }

      return json(
        { toastMessage },
        { headers: { "Set-Cookie": await commitSession(session) } }
      );
    });
  } catch (error) {
    console.error(error);
    return json({ toastMessage: null });
  }
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <GlobalLoading />
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function App() {
  const { toast } = useToast();
  const { toastMessage } = useLoaderData<typeof loader>();
  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const { message, type } = toastMessage;

    switch (type) {
      case "success":
        toast({
          title: "Success",
          description: message,
          variant: "success",
        });
        break;
      case "error":
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
        break;
      default:
        throw new Error(`${type} is not handled`);
    }
  }, [toastMessage, toast]);
  return <Outlet />;
}

export default ClerkApp(App);
