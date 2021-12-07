import React from 'react';
import CS from 'classnames';
import styles from './index12.less';

const TestCss = () => {
  return (
    <>
      {/* <div className={styles.box}>
        When we were learning about using the Effect Hook, we saw this component from a chat
        application that displays a message indicating whether a friend is online or offline:
      </div> */}
      {/* <div className={CS([styles.box, styles.boxSmall])}>
        When we were learning about using the Effect Hook
      </div>
      <div className={CS([styles.box, styles.boxLarge])}>
        When we were learning about using the Effect Hook
      </div>

      <div className={styles.parent}>
        <div className={styles.childTitle}>use the Effect Hook</div>
        We could copy and paste similar logic above into our FriendListItem component but it
        wouldn’t be ideal
      </div>

      <div className={styles.slogan}>We love hooks</div>

      <div className={styles}>
        <ul>
          <li>
            一级列表
            <ul>
              <li>
                二级列表
                <ul>
                  <li>
                    三级列表
                    <ul>
                      <li>
                        四级列表
                        <ul>
                          <li>五级列表</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div> */}
      <div className={styles.container}>
        Unlike a React component, a custom Hook doesn’t need to have a specific signature. We can
        decide what it takes as arguments, and what, if anything, it should return. In other words,
        it’s just like a normal function. Its name should always start with use so that you can tell
        at a glance that the rules of Hooks apply to it.
      </div>
    </>
  );
};

export default TestCss;
