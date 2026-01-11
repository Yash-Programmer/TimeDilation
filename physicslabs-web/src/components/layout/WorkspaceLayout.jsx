// components/layout/WorkspaceLayout.jsx
import { AppShell, Group, Burger, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import LeftSidebar from './LeftSidebar';
import CenterArea from './CenterArea';
import RightSidebar from './RightSidebar';
import { IconHelp, IconDownload, IconShare } from '@tabler/icons-react';

export default function WorkspaceLayout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      aside={{
        width: 300,
        breakpoint: 'md',
        collapsed: { desktop: false, mobile: true },
      }}
      padding="0"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text size="xl" fw={700}>PhysicsLab</Text>
          </Group>
          <Group>
            <Button leftSection={<IconHelp size={16} />} variant="subtle">Help</Button>
            <Button leftSection={<IconDownload size={16} />} variant="subtle">Export</Button>
            <Button leftSection={<IconShare size={16} />} variant="subtle">Share</Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <LeftSidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <CenterArea />
      </AppShell.Main>

      <AppShell.Aside p="md">
        <RightSidebar />
      </AppShell.Aside>
    </AppShell>
  );
}
