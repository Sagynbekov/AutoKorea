/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Reference implementation for a Service layer.
 * Business logic belongs here.
 */

export const ExampleService = {
  processData: (input: string): string => {
    // Business rules logic
    return `Processed: ${input}`;
  }
};
