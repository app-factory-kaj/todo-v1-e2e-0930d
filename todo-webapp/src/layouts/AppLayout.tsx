import { AppShell, Header, Footer, ColorSchemeToggle } from "@wso2/oxygen-ui";
import { Outlet } from "react-router";
import type { JSX } from "react";

// wireframes.dsl draws `navbar "Todo App"` with no `sidebar` line on either
// screen — a brand-only navbar and no sidebar rail, because the app has one
// flow ("Manage todos") and no nav links to populate it with. There is also
// no sign-in, so the header carries no UserMenu.
export default function AppLayout(): JSX.Element {
  return (
    <AppShell>
      <AppShell.Navbar>
        <Header>
          <Header.Brand>
            <Header.BrandTitle>Todo App</Header.BrandTitle>
          </Header.Brand>
          <Header.Spacer />
          <Header.Actions>
            <ColorSchemeToggle />
          </Header.Actions>
        </Header>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer>
        <Footer>
          <Footer.Copyright>© WSO2 LLC</Footer.Copyright>
        </Footer>
      </AppShell.Footer>
    </AppShell>
  );
}
