import React from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";

function AddBorrowModal({
  isBorrowModalVisible,
  handleBorrowCancel,
  onFinishlentandborrow,
}) {
  const [form] = Form.useForm();
  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Borrow Amount"
      open={isBorrowModalVisible}
      onCancel={handleBorrowCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinishlentandborrow(values, "borrow");
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Person From Whom You Borrowed"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the borrowed amount!" },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date "
          name="date"
          rules={[
            { required: true, message: "Please select the borrowed date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Due Date"
          name="duedate"
          rules={[
            { required: true, message: "Please select the Due date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Tag"
          name="tag"
          rules={[{ required: true, message: "Please select a tag!" }]}
        >
          <Select className="select-input-2">
          <Select.Option value="Food">Food</Select.Option>
            <Select.Option value="Movie">Movie</Select.Option>
            <Select.Option value="Stationary">Stationary</Select.Option>
            <Select.Option value="Education">Education</Select.Option>
            <Select.Option value="Travel">Travel</Select.Option>
            <Select.Option value="Others">Others</Select.Option>
            
          </Select>
        </Form.Item>
        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Borrow Amount
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddBorrowModal;
