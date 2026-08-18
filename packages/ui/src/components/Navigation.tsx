import type { ReactNode } from "react";

export type NavigationItem = {
  href: string;
  label: string;
  icon?: ReactNode;
  current?: boolean;
  badge?: ReactNode;
};

export function AccountNavigation({ items, label = "Account" }: { items: NavigationItem[]; label?: string }) {
  return (
    <nav className="endoora-account-nav" aria-label={label}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <a href={item.href} aria-current={item.current ? "page" : undefined}>
              {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
              <span>{item.label}</span>
              {item.badge ? <span className="endoora-account-nav__badge">{item.badge}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export type RoleShellProps = {
  role: "public" | "learner" | "teacher" | "admin";
  title: string;
  navigation: NavigationItem[];
  topBar?: ReactNode;
  children: ReactNode;
  contentLandmark?: boolean;
};

export function RoleShell({ role, title, navigation, topBar, children, contentLandmark = true }: RoleShellProps) {
  return (
    <div className="endoora-role-shell" data-role={role}>
      <aside className="endoora-role-shell__sidebar">
        <div className="endoora-role-shell__brand">Endoora</div>
        <nav aria-label={`${title} primary navigation`}>
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} aria-current={item.current ? "page" : undefined}>
                  {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
                  <span>{item.label}</span>
                  {item.badge ? <span className="endoora-role-shell__badge">{item.badge}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="endoora-role-shell__main">
        {topBar ? <header className="endoora-role-shell__topbar">{topBar}</header> : null}
        {contentLandmark ? (
          <main className="endoora-role-shell__content">{children}</main>
        ) : (
          <div className="endoora-role-shell__content">{children}</div>
        )}
      </div>
      <nav className="endoora-role-shell__bottom" aria-label={`${title} mobile navigation`}>
        <ul>
          {navigation.slice(0, 5).map((item) => (
            <li key={item.href}>
              <a href={item.href} aria-current={item.current ? "page" : undefined}>
                {item.icon ? <span aria-hidden="true">{item.icon}</span> : null}
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
