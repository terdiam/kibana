/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { formatNumber } from '../../../lib/format_number';
import {
  ClusterItemContainer,
  BytesPercentageUsage,
  DisabledIfNoDataAndInSetupModeLink,
} from './helpers';
import { LOGSTASH, LOGSTASH_SYSTEM_ID } from '../../../../common/constants';

import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiTitle,
  EuiPanel,
  EuiDescriptionList,
  EuiDescriptionListTitle,
  EuiDescriptionListDescription,
  EuiHorizontalRule,
  EuiIconTip,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { i18n } from '@kbn/i18n';
import { get } from 'lodash';
import { SetupModeTooltip } from '../../setup_mode/tooltip';

export function LogstashPanel(props) {
  const { setupMode } = props;
  const nodesCount = props.node_count || 0;
  const queueTypes = props.queue_types || {};

  // Do not show if we are not in setup mode
  if (!nodesCount && !setupMode.enabled) {
    return null;
  }

  const goToLogstash = () => props.changeUrl('logstash');
  const goToNodes = () => props.changeUrl('logstash/nodes');
  const goToPipelines = () => props.changeUrl('logstash/pipelines');

  const setupModeData = get(setupMode.data, 'logstash');
  const setupModeTooltip =
    setupMode && setupMode.enabled ? (
      <SetupModeTooltip
        setupModeData={setupModeData}
        productName={LOGSTASH_SYSTEM_ID}
        badgeClickAction={goToNodes}
      />
    ) : null;

  return (
    <ClusterItemContainer
      {...props}
      url="logstash"
      title={i18n.translate('xpack.monitoring.cluster.overview.logstashPanel.logstashTitle', {
        defaultMessage: 'Logstash',
      })}
    >
      <EuiFlexGrid columns={4}>
        <EuiFlexItem>
          <EuiPanel paddingSize="m">
            <EuiTitle size="s">
              <h3>
                <DisabledIfNoDataAndInSetupModeLink
                  setupModeEnabled={setupMode.enabled}
                  setupModeData={setupModeData}
                  onClick={goToLogstash}
                  aria-label={i18n.translate(
                    'xpack.monitoring.cluster.overview.logstashPanel.overviewLinkAriaLabel',
                    {
                      defaultMessage: 'Logstash Overview',
                    }
                  )}
                >
                  <FormattedMessage
                    id="xpack.monitoring.cluster.overview.logstashPanel.overviewLinkLabel"
                    defaultMessage="Overview"
                  />
                </DisabledIfNoDataAndInSetupModeLink>
              </h3>
            </EuiTitle>
            <EuiHorizontalRule margin="m" />
            <EuiDescriptionList type="column" data-test-subj="logstash_overview">
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.eventsReceivedLabel"
                  defaultMessage="Events Received"
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription data-test-subj="lsEventsReceived">
                {formatNumber(props.events_in_total, '0.[0]a')}
              </EuiDescriptionListDescription>
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.eventsEmittedLabel"
                  defaultMessage="Events Emitted"
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription data-test-subj="lsEventsEmitted">
                {formatNumber(props.events_out_total, '0.[0]a')}
              </EuiDescriptionListDescription>
            </EuiDescriptionList>
          </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiPanel paddingSize="m">
            <EuiFlexGroup justifyContent="spaceBetween">
              <EuiFlexItem grow={false}>
                <EuiTitle size="s">
                  <h3>
                    <EuiLink
                      onClick={goToNodes}
                      data-test-subj="lsNodes"
                      aria-label={i18n.translate(
                        'xpack.monitoring.cluster.overview.logstashPanel.nodesCountLinkAriaLabel',
                        {
                          defaultMessage: 'Logstash Nodes: {nodesCount}',
                          values: { nodesCount },
                        }
                      )}
                    >
                      <FormattedMessage
                        id="xpack.monitoring.cluster.overview.logstashPanel.nodesCountLinkLabel"
                        defaultMessage="Nodes: {nodesCount}"
                        values={{
                          nodesCount: (
                            <span data-test-subj="number_of_logstash_instances">{nodesCount}</span>
                          ),
                        }}
                      />
                    </EuiLink>
                  </h3>
                </EuiTitle>
              </EuiFlexItem>
              {setupModeTooltip}
            </EuiFlexGroup>
            <EuiHorizontalRule margin="m" />
            <EuiDescriptionList type="column">
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.uptimeLabel"
                  defaultMessage="Uptime"
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription data-test-subj="lsUptime">
                {props.max_uptime ? formatNumber(props.max_uptime, 'time_since') : 0}
              </EuiDescriptionListDescription>
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.jvmHeapLabel"
                  defaultMessage="{javaVirtualMachine} Heap"
                  values={{ javaVirtualMachine: 'JVM' }}
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription data-test-subj="lsJvmHeap">
                <BytesPercentageUsage
                  usedBytes={props.avg_memory_used}
                  maxBytes={props.avg_memory}
                />
              </EuiDescriptionListDescription>
            </EuiDescriptionList>
          </EuiPanel>
        </EuiFlexItem>

        <EuiFlexItem>
          <EuiPanel paddingSize="m">
            <EuiFlexGroup alignItems="center" gutterSize="m">
              <EuiFlexItem grow={false}>
                <EuiTitle size="s">
                  <h3>
                    <DisabledIfNoDataAndInSetupModeLink
                      setupModeEnabled={setupMode.enabled}
                      setupModeData={setupModeData}
                      onClick={goToPipelines}
                      data-test-subj="lsPipelines"
                      aria-label={i18n.translate(
                        'xpack.monitoring.cluster.overview.logstashPanel.pipelineCountLinkAriaLabel',
                        {
                          defaultMessage: 'Logstash Pipelines (beta feature): {pipelineCount}',
                          values: { pipelineCount: props.pipeline_count },
                        }
                      )}
                    >
                      <FormattedMessage
                        id="xpack.monitoring.cluster.overview.logstashPanel.pipelinesCountLinkLabel"
                        defaultMessage="Pipelines: {pipelineCount}"
                        values={{
                          pipelineCount: (
                            <span data-test-subj="number_of_logstash_pipelines">
                              {props.pipeline_count}
                            </span>
                          ),
                        }}
                      />
                    </DisabledIfNoDataAndInSetupModeLink>
                  </h3>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiIconTip
                  content={i18n.translate(
                    'xpack.monitoring.cluster.overview.logstashPanel.betaFeatureTooltip',
                    {
                      defaultMessage: 'Beta feature',
                    }
                  )}
                  position="bottom"
                  type="beaker"
                  aria-label="Beta feature"
                />
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiHorizontalRule margin="m" />
            <EuiDescriptionList type="column">
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.withMemoryQueuesLabel"
                  defaultMessage="With Memory Queues"
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription>
                {queueTypes[LOGSTASH.QUEUE_TYPES.MEMORY] || 0}
              </EuiDescriptionListDescription>
              <EuiDescriptionListTitle>
                <FormattedMessage
                  id="xpack.monitoring.cluster.overview.logstashPanel.withPersistentQueuesLabel"
                  defaultMessage="With Persistent Queues"
                />
              </EuiDescriptionListTitle>
              <EuiDescriptionListDescription>
                {queueTypes[LOGSTASH.QUEUE_TYPES.PERSISTED] || 0}
              </EuiDescriptionListDescription>
            </EuiDescriptionList>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGrid>
    </ClusterItemContainer>
  );
}
