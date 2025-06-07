export type Cancel = () => void;
export type AsyncCancel = () => Promise<void>;

export type CancelGroup = {
  cancel: AsyncCancel;
  add: (cancel: Cancel | AsyncCancel) => void;
};

/** Creates a group of cancelation functions */
export const createCancelGroup = (): CancelGroup => {
  const cancels: Set<AsyncCancel> = new Set();

  const cancel = async (): Promise<void> => {
    for (const cancel of cancels) {
      await cancel();
    }
    cancels.clear();
  };

  const add = (cancel: Cancel | AsyncCancel): void => {
    cancels.add(cancel as AsyncCancel);
  };

  return { cancel, add };
};
