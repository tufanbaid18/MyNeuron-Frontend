import { Link } from "@tanstack/react-router";
import { BiMessageSquareDots } from "react-icons/bi";
import { GoBook, GoHome, GoPulse } from "react-icons/go";
import { APP_ROUTES } from "./app.routes";

export const SIDEBAR_MENU_ITEMS = [
  {
    key: "1",
    icon: <GoHome />,
    label: (
      <Link to={APP_ROUTES.PLASMA} className="block w-full">
        Dashboard
      </Link>
    ),
  },
  {
    key: "2",
    icon: <GoPulse />,
    label: "GATC",
    children: [
      {
        key: "2a",
        label: (
          <Link to={APP_ROUTES.GATC} className="block w-full">
            GATC 2026
          </Link>
        ),
        children: [
          {
            key: "2a1",
            label: (
              <Link to={APP_ROUTES.GATC_PROGRAMS} className="block w-full">
                Programs
              </Link>
            ),
          },
          {
            key: "2a2",
            label: (
              <Link to={APP_ROUTES.GATC_SPEAKERS} className="block w-full">
                Speakers
              </Link>
            ),
          },
          {
            key: "2a3",
            label: (
              <Link to={APP_ROUTES.GATC_PARTICIPANTS} className="block w-full">
                Participants
              </Link>
            ),
          },
          {
            key: "2a4",
            label: (
              <Link to={APP_ROUTES.GATC_MY_HANDSHAKES} className="block w-full">
                My Handshakes
              </Link>
            ),
          },
        ],
      },
    ],
  },
  {
    key: "3",
    icon: <GoBook />,
    label: (
      <Link to={APP_ROUTES.MY_BOOKSHELF} className="block w-full">
        My Bookshelf
      </Link>
    ),
  },
  {
    key: "4",
    icon: <BiMessageSquareDots />,
    label: (
      <Link to={APP_ROUTES.IMPULSE} className="block w-full">
        Impulse
      </Link>
    ),
  },
];
