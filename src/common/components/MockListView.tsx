import styled from "@emotion/styled";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import MockActionButton from "~/common/components/MockActionButton";
import {
  alphaColor,
  em,
  percent,
  PRIMITIVE_COLOR,
  px
} from "~/common/lib/css-util";
import type CommonActionParameter from "~/common/scheme/CommonActionParameter";

type TagParameter = {
  label: string;
  color: `#${string}`;
};

export type MockDataItemProps = {
  key: string | number;
  statusTag?: TagParameter;
  title: ReactNode;
  subTitle?: ReactNode;
  tags?: TagParameter[];
  thumbnail?: {
    src?: string;
  };
  mainAction?: CommonActionParameter;
  actions?: ComponentPropsWithoutRef<typeof MockActionButton<string>>[];
};

const ActionFooterWrapper = styled.ul({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: em(0.5)
});

const DataListItem = styled.li({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: em(0.5),
  marginBottom: em(0.5),
  "&:last-child": {
    marginBottom: em(0)
  }
});

const DataListMainCell = styled.div({
  flexGrow: 1
});

const DataListSubTitle = styled.p({
  fontSize: percent(80),
  whiteSpace: "pre-wrap"
});

const DataListImageCell = styled.div({
  position: "relative",
  width: em(5),
  paddingBottom: em((9 / 16) * 5),
  backgroundColor: alphaColor(PRIMITIVE_COLOR.BLACK, 0.5),
  overflow: "hidden",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center"
});

const MockListView = ({ dataList }: { dataList: MockDataItemProps[] }) => {
  if (!dataList.length) {
    return <div>データがありません</div>;
  }
  return (
    <ul>
      {dataList.map(
        ({
          key,
          statusTag,
          title,
          subTitle,
          tags,
          thumbnail,
          mainAction,
          actions
        }) => (
          <DataListItem key={key}>
            {statusTag ? (
              <span style={{ backgroundColor: statusTag.color }}>
                {statusTag.label}
              </span>
            ) : null}
            {thumbnail ? (
              <DataListImageCell
                style={{
                  backgroundImage: thumbnail.src
                    ? `url('${thumbnail.src}')`
                    : "none"
                }}
              />
            ) : null}
            <DataListMainCell>
              {mainAction ? (
                <MockActionButton action={mainAction}>{title}</MockActionButton>
              ) : (
                title
              )}
              {subTitle ? (
                <DataListSubTitle>{subTitle}</DataListSubTitle>
              ) : null}
              {tags && tags.length ? (
                <DataListSubTitle
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: px(10)
                  }}
                >
                  {tags.map(({ label, color }) => (
                    <span key={label} style={{ backgroundColor: color }}>
                      {label}
                    </span>
                  ))}
                </DataListSubTitle>
              ) : null}
            </DataListMainCell>
            {actions && actions.length ? (
              <ActionFooterWrapper>
                {actions.map(({ children, action }) => (
                  <li key={children}>
                    <MockActionButton action={action}>
                      {children}
                    </MockActionButton>
                  </li>
                ))}
              </ActionFooterWrapper>
            ) : null}
          </DataListItem>
        )
      )}
    </ul>
  );
};

export default MockListView;
