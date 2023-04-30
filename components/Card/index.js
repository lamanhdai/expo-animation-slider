import { useEffect, useState, useRef } from 'react'
import { View, Dimensions, StyleSheet, Image } from 'react-native';
import { PanGestureHandler, TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
// import { snapPoint } from "react-native-redash";

const { width } = Dimensions.get("window");

const aspectRatio = 722 / 368;
const CARD_WIDTH = width - 128;
const CARD_HEIGHT = CARD_WIDTH * aspectRatio;
const DURATION = 250;

export default function Card({index, backgroundColor = 'white', onChangeList, data, url, itemId}) {
  const x = useSharedValue(0);
  const y = useSharedValue(index*(-7));
  const rotateZ = useSharedValue(0);
  const scaleX = useSharedValue(1-((-index)*0.05));
  const PanRef = useRef(null);
  const cardList = data;
  const prevIndex = useRef()

  useEffect(() => {
    const delay = 10;
    if(prevIndex.current != index && prevIndex.current == (cardList.length - 2)) {
      // initialize and animate the second layer
      scaleX.value = 1-((-prevIndex.current)*0.05);
      y.value = prevIndex.current*(-7);
      x.value = 7;
      scaleX.value = withTiming(1-((-index)*0.05), { duration: DURATION, easing: Easing.inOut(Easing.ease) });
      y.value = withTiming(index*(-7) , { duration: DURATION, easing: Easing.inOut(Easing.ease) });
      x.value = withTiming(0 , { duration: DURATION, easing: Easing.inOut(Easing.ease) });
    } if(prevIndex.current != index && prevIndex.current == (cardList.length - 1)) {
      // initialize and animate the first layer
      scaleX.value = 1-((-prevIndex.current)*0.05);
      y.value = prevIndex.current*(-7);
      scaleX.value = withTiming(1-((-index)*0.05), { duration: DURATION, easing: Easing.inOut(Easing.ease) });
      y.value = withTiming(index*(-7) , { duration: DURATION, easing: Easing.inOut(Easing.ease) });
    } else {
      // animate the rest cards
      scaleX.value = withDelay(
        delay,
        withTiming(1-((-index)*0.05), { duration: DURATION, easing: Easing.inOut(Easing.ease) })
      );
      y.value = withTiming(index*(-7) , { duration: DURATION, easing: Easing.inOut(Easing.ease) });
    }
    // update the previous index later to prepare animation next time
    prevIndex.current = index;
  }, [index]);

  const wrapper = (args) => {
    onChangeList(args);
  };

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: ({}, ctx) => {
      ctx.x = x.value;
      ctx.y = y.value;
      ctx.rotateZ = rotateZ.value;
      ctx.scaleX = scaleX.value;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      x.value = ctx.x + translationX;
      y.value = withSpring(ctx.y + translationY, {velocity: translationY});
      rotateZ.value = ctx.rotateZ + (translationX/12);
      scaleX.value = withSpring(ctx.scaleX, {velocity: 10});
    },
    onEnd: ({ translationX }) => {
      x.value = withSpring(0, { velocity: translationX });
      y.value = withSpring((-7)*index, { velocity: 10 });
      rotateZ.value = withSpring(0, { velocity: 10 });
      scaleX.value = withSpring(scaleX.value, { velocity: 10 });
    },
  });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value??0 },
      { translateY: y.value??0 },
      { rotateZ: rotateZ.value+'deg' },
      { scaleX: Number(scaleX.value) }
    ]
  }));
  
  const onSingleTapEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      runOnJS(wrapper)({backgroundColor, url, id: itemId});
    }
  };

  const onDragDropEvent = (event) => {
    if (event.nativeEvent.state === State.END) {
      runOnJS(wrapper)({backgroundColor, url, id: itemId});
    }
  };

  return (
    <TapGestureHandler onHandlerStateChange={onSingleTapEvent} waitFor={PanRef}>
      <View style={styles.container}>
        <PanGestureHandler onGestureEvent={onGestureEvent} ref={PanRef} onHandlerStateChange={onDragDropEvent}>
          <Animated.View style={[styles.card, style, {backgroundColor: backgroundColor}]}>
            <Image style={styles.photo} source={url} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </TapGestureHandler>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 20,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5A5A5A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  photo: {
    borderRadius: 20,
    width: '100%',
    height: '100%'
  }
})