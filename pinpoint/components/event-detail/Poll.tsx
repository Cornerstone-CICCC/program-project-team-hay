import { Text, View } from 'react-native'
import { Accordion } from '@animatereactnative/accordion';
import Entypo from '@expo/vector-icons/Entypo';
import React from 'react'

const Poll = () => {
    return (<Accordion.Accordion>
      <Accordion.Header>
        <Text>AnimateReactNative.com</Text>
        <Accordion.HeaderIcon>
            <Entypo name="chevron-thin-up" size={24} color="black" />
        </Accordion.HeaderIcon>
      </Accordion.Header>

      <Accordion.Collapsed>
        <Text>Visible !expanded</Text>
      </Accordion.Collapsed>
      <Accordion.Always>
        <Text>Always visible</Text>
      </Accordion.Always>

      <Accordion.Expanded>
        <Text>Expanded content</Text>
      </Accordion.Expanded>
    </Accordion.Accordion>
  )
}

export default Poll
