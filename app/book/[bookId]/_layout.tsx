import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/src/constants/colors';
import { BookProvider } from '@/src/context/BookContext';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function BookLayout() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const id = parseInt(bookId, 10);

  return (
    <BookProvider bookId={id}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.inkBlue,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.borderHeavy,
            borderTopWidth: 2,
            height: 88,
            paddingBottom: 28,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontFamily: 'IBMPlexMono-Regular',
            fontSize: 11,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Ledger',
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'New Entry',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="pencil-square-o" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Summary',
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="bar-chart" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </BookProvider>
  );
}
