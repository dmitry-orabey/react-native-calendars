import React, { Component } from "react";
import { ActivityIndicator, ImageBackground } from "react-native";
import { View, Text, TouchableOpacity, Image } from "react-native";
import XDate from "xdate";
import PropTypes from "prop-types";
import styleConstructor from "./style";
import { weekDayNames } from "../../dateutils";
import {
  CHANGE_MONTH_LEFT_ARROW,
  CHANGE_MONTH_RIGHT_ARROW
} from "../../testIDs";

const monthsBackground = {
  January: require("../../../../../assets/images/months/January.png"),
  February: require("../../../../../assets/images/months/February.png"),
  March: require("../../../../../assets/images/months/March.png"),
  April: require("../../../../../assets/images/months/April.png"),
  May: require("../../../../../assets/images/months/May.png"),
  June: require("../../../../../assets/images/months/June.png"),
  July: require("../../../../../assets/images/months/July.png"),
  August: require("../../../../../assets/images/months/August.png"),
  September: require("../../../../../assets/images/months/September.png"),
  October: require("../../../../../assets/images/months/October.png"),
  November: require("../../../../../assets/images/months/November.png"),
  December: require("../../../../../assets/images/months/December.png")
};

class CalendarHeader extends Component {
  static displayName = "IGNORE";

  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func
  };

  static defaultProps = {
    monthFormat: "MMMM yyyy"
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.month.toString("yyyy MM") !==
      this.props.month.toString("yyyy MM")
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    if (nextProps.firstDay !== this.props.firstDay) {
      return true;
    }
    if (nextProps.weekNumbers !== this.props.weekNumbers) {
      return true;
    }
    if (nextProps.monthFormat !== this.props.monthFormat) {
      return true;
    }
    return false;
  }

  onPressLeft() {
    const { onPressArrowLeft } = this.props;
    if (typeof onPressArrowLeft === "function") {
      return onPressArrowLeft(this.substractMonth, this.props.month);
    }
    return this.substractMonth();
  }

  onPressRight() {
    const { onPressArrowRight } = this.props;
    if (typeof onPressArrowRight === "function") {
      return onPressArrowRight(this.addMonth, this.props.month);
    }
    return this.addMonth();
  }

  render() {
    let leftArrow = <View />;
    let rightArrow = <View />;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    const { testID } = this.props;

    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={this.onPressLeft}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={
            testID
              ? `${CHANGE_MONTH_LEFT_ARROW}-${testID}`
              : CHANGE_MONTH_LEFT_ARROW
          }
        >
          {this.props.renderArrow ? (
            this.props.renderArrow("left")
          ) : (
            <Image
              source={require("../img/previous.png")}
              style={this.style.arrowImage}
            />
          )}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity
          onPress={this.onPressRight}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={
            testID
              ? `${CHANGE_MONTH_RIGHT_ARROW}-${testID}`
              : CHANGE_MONTH_RIGHT_ARROW
          }
        >
          {this.props.renderArrow ? (
            this.props.renderArrow("right")
          ) : (
            <Image
              source={require("../img/next.png")}
              style={this.style.arrowImage}
            />
          )}
        </TouchableOpacity>
      );
    }

    let indicator;
    if (this.props.showIndicator) {
      indicator = (
        <ActivityIndicator
          color={this.props.theme && this.props.theme.indicatorColor}
        />
      );
    }

    return (
      <View style={this.props.style}>
        <View style={this.style.header}>
          <ImageBackground
            source={
              monthsBackground[
                this.props.month.toString(this.props.monthFormat)
              ]
            }
            style={{ width: "100%", height: "100%", alignItems: "center" }}
          >
            {leftArrow}
            <View style={{ flexDirection: "row" }}>
              <Text
                allowFontScaling={false}
                style={this.style.monthText}
                accessibilityTraits="header"
              >
                {this.props.month.toString(this.props.monthFormat)}
              </Text>
              {indicator}
            </View>
            {rightArrow}
          </ImageBackground>
        </View>
        {!this.props.hideDayNames && (
          <View style={this.style.week}>
            {this.props.weekNumbers && (
              <Text allowFontScaling={false} style={this.style.dayHeader} />
            )}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={idx}
                accessible={false}
                style={this.style.dayHeader}
                numberOfLines={1}
                importantForAccessibility="no"
              >
                {day}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }
}

export default CalendarHeader;
