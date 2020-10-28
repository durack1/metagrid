import { InfoCircleOutlined } from '@ant-design/icons';
import { Checkbox, Collapse, Form, Select } from 'antd';
import React from 'react';
import { CSSinJS } from '../../common/types';
import StatusToolTip from '../NodeStatus/StatusToolTip';
import { NodeStatusArray } from '../NodeStatus/types';
import { ActiveFacets, DefaultFacets, ParsedFacets } from './types';

const styles: CSSinJS = {
  container: { maxHeight: '80vh', overflowY: 'auto' },
  facetCount: { float: 'right' },
  formTitle: { fontWeight: 'bold', textTransform: 'capitalize' },
  applyBtn: { marginBottom: '12px' },
  collapseContainer: { marginTop: '12px' },
};

export type Props = {
  facetsByGroup?: { [key: string]: string[] };
  defaultFacets: DefaultFacets;
  activeFacets: ActiveFacets | Record<string, unknown>;
  projectFacets: ParsedFacets;
  nodeStatus?: NodeStatusArray;
  onValuesChange: (allValues: { [key: string]: string[] | [] }) => void;
};

/**
 * Converts facet names from snake_case to human readable.
 *
 * It also checks for acronyms to convert to uppercase.
 */
export const humanizeFacetNames = (str: string): string => {
  const acronyms = ['Id', 'Cf', 'Cmor', 'Mip'];
  const frags = str.split('_');

  for (let i = 0; i < frags.length; i += 1) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);

    if (acronyms.includes(frags[i])) {
      frags[i] = frags[i].toUpperCase();
    }
  }

  return frags.join(' ');
};

const FacetsForm: React.FC<Props> = ({
  facetsByGroup,
  defaultFacets,
  activeFacets,
  projectFacets,
  nodeStatus,
  onValuesChange,
}) => {
  const [projectFacetsForm] = Form.useForm();

  /**
   * Need to reset the project facet form's fields whenever the active and default
   * facets change in order to capture the correct number of facet counts per option
   */
  React.useEffect(() => {
    projectFacetsForm.resetFields();
  }, [projectFacetsForm, activeFacets, defaultFacets]);

  return (
    <div data-testid="facets-form">
      <Form
        form={projectFacetsForm}
        layout="vertical"
        initialValues={{
          ...activeFacets,
          selectedDefaults: Object.keys(defaultFacets).filter(
            (k) => defaultFacets[k]
          ),
        }}
        onValuesChange={(_changedValues, allValues) => {
          onValuesChange(allValues);
        }}
      >
        <Form.Item name="selectedDefaults">
          <Checkbox.Group
            options={[{ label: 'Include Replica', value: 'replica' }]}
          ></Checkbox.Group>
        </Form.Item>
        <div style={styles.container}>
          {facetsByGroup &&
            Object.keys(facetsByGroup).map((group) => {
              return (
                <div key={group} style={styles.collapseContainer}>
                  <h4 style={styles.formTitle}>{group}</h4>
                  <Collapse>
                    {Object.keys(projectFacets).map((facet) => {
                      if (facetsByGroup[group].includes(facet)) {
                        const facetOptions = projectFacets[facet];
                        const isOptionalforDatasets = facetOptions[0].includes(
                          'none'
                        );
                        return (
                          <Collapse.Panel
                            header={humanizeFacetNames(facet)}
                            key={facet}
                          >
                            <Form.Item
                              style={{ marginBottom: '4px' }}
                              key={facet}
                              name={facet}
                              label={
                                isOptionalforDatasets ? '(Optional)' : undefined
                              }
                              tooltip={
                                isOptionalforDatasets
                                  ? {
                                      title:
                                        'Selecting the "none" option filters for datasets that do not use this facet.',
                                      icon: <InfoCircleOutlined />,
                                    }
                                  : undefined
                              }
                            >
                              <Select
                                data-testid={`${facet}-form-select`}
                                size="small"
                                placeholder="Select option(s)"
                                mode="multiple"
                                style={{ width: '100%' }}
                                tokenSeparators={[',']}
                                showArrow
                              >
                                {facetOptions.map((variable) => {
                                  let optionOutput:
                                    | string
                                    | React.ReactElement = (
                                    <>
                                      {variable[0]}
                                      <span style={styles.facetCount}>
                                        ({variable[1]})
                                      </span>
                                    </>
                                  );
                                  // The data node facet has a unique tooltip overlay to show the status of the highlighted node
                                  if (facet === 'data_node') {
                                    optionOutput = (
                                      <StatusToolTip
                                        nodeStatus={nodeStatus}
                                        dataNode={variable[0]}
                                      >
                                        <span style={styles.facetCount}>
                                          ({variable[1]})
                                        </span>
                                      </StatusToolTip>
                                    );
                                  }
                                  return (
                                    <Select.Option
                                      key={variable[0]}
                                      value={variable[0]}
                                    >
                                      <span
                                        data-testid={`${facet}_${variable[0]}`}
                                      >
                                        {optionOutput}
                                      </span>
                                    </Select.Option>
                                  );
                                })}
                              </Select>
                            </Form.Item>
                          </Collapse.Panel>
                        );
                      }
                      return null;
                    })}
                  </Collapse>
                </div>
              );
            })}
        </div>
      </Form>
    </div>
  );
};

export default FacetsForm;
