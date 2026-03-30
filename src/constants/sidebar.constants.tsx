import { Link } from "@tanstack/react-router";
import { APP_ROUTES } from "./app.routes";
import DashboardIcon from "../components/icons/DashboardIcon";
import GatcIcon from "../components/icons/GatcIcon";
import BookshelfIcon from "../components/icons/BookshelfIcon";
import ImpulseIcon from "../components/icons/ImpulseIcon";

export const SIDEBAR_MENU_ITEMS = ({ gatcActive }: { gatcActive: boolean }) => {
  return [
    {
      key: "1",
      icon: <DashboardIcon />,
      label: (
        <Link to={APP_ROUTES.PLASMA} className="block w-full">
          Dashboard
        </Link>
      ),
    },
    {
      key: "2",
      icon: <GatcIcon />,
      label: "GATC",
      children: [
        {
          key: "2a",
          label: (
            <Link to={APP_ROUTES.GATC} className="block w-full">
              GATC 2026
            </Link>
          ),
          children: gatcActive
            ? [
                {
                  key: "2a1",
                  label: (
                    <Link
                      to={APP_ROUTES.GATC_PROGRAMS}
                      className="block w-full"
                    >
                      Programs
                    </Link>
                  ),
                },
                {
                  key: "2a2",
                  label: (
                    <Link
                      to={APP_ROUTES.GATC_SPEAKERS}
                      className="block w-full"
                    >
                      Speakers
                    </Link>
                  ),
                },
                {
                  key: "2a3",
                  label: (
                    <Link
                      to={APP_ROUTES.GATC_PARTICIPANTS}
                      className="block w-full"
                    >
                      Participants
                    </Link>
                  ),
                },
                {
                  key: "2a4",
                  label: (
                    <Link
                      to={APP_ROUTES.GATC_MY_HANDSHAKES}
                      className="block w-full"
                    >
                      My Handshakes
                    </Link>
                  ),
                },
              ]
            : null,
        },
      ],
    },
    {
      key: "3",
      icon: <BookshelfIcon />,
      label: (
        <Link to={APP_ROUTES.MY_BOOKSHELF} className="block w-full">
          My Bookshelf
        </Link>
      ),
    },
    {
      key: "4",
      icon: <ImpulseIcon />,
      label: (
        <Link to={APP_ROUTES.IMPULSE} className="block w-full">
          Impulse
        </Link>
      ),
    },
  ];
};
